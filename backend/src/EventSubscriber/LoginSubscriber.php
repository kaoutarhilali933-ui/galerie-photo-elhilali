<?php

namespace App\EventSubscriber;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Event\LoginFailureEvent;
use Symfony\Component\Security\Http\Event\LoginSuccessEvent;

class LoginSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $em
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            LoginFailureEvent::class => 'onLoginFailure',
            LoginSuccessEvent::class => 'onLoginSuccess',
        ];
    }

    public function onLoginFailure(LoginFailureEvent $event): void
    {
        $data = json_decode($event->getRequest()->getContent() ?? '', true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return;
        }

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return;
        }

        // si déjà bloqué, on ne touche plus au compteur
        if ($user->isBlocked()) {
            return;
        }

        $attempts = $user->getFailedAttempts() + 1;
        $user->setFailedAttempts($attempts);

        if ($attempts >= 3) {
            $user->setIsBlocked(true);
        }

        $this->em->flush();
    }

    public function onLoginSuccess(LoginSuccessEvent $event): void
    {
        $user = $event->getUser();

        if (!$user || !method_exists($user, 'setFailedAttempts') || !method_exists($user, 'isBlocked')) {
            return;
        }

        // si bloqué, on ne reset pas
        if ($user->isBlocked()) {
            return;
        }

        $user->setFailedAttempts(0);
        $this->em->flush();
    }
}