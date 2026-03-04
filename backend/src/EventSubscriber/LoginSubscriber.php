<?php

namespace App\EventSubscriber;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
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
        // 1) Récupérer l’email envoyé dans le body JSON
        $data = json_decode($event->getRequest()->getContent() ?? '', true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return;
        }

        $user = $this->userRepository->findOneBy(['email' => $email]);

        // Si l’utilisateur n’existe pas : on ne donne pas d’info
        if (!$user) {
            return;
        }

        // 2) Si déjà bloqué -> message direct
        if ($user->isBlocked()) {
            throw new CustomUserMessageAuthenticationException('Account blocked after 3 failed attempts');
        }

        // 3) Incrémenter les tentatives
        $attempts = $user->getFailedAttempts() + 1;
        $user->setFailedAttempts($attempts);

        // 4) Calculer tentatives restantes
        $remaining = 3 - $attempts;

        // 5) Si on atteint 3 -> bloquer + message blocage
        if ($attempts >= 3) {
            $user->setIsBlocked(true);
            $this->em->flush();

            throw new CustomUserMessageAuthenticationException('Account blocked after 3 failed attempts');
        }

        // 6) Sinon -> sauvegarder + message "tentatives restantes"
        $this->em->flush();

        $msg = 'Invalid credentials. ' . $remaining . ' attempt' . ($remaining > 1 ? 's' : '') . ' remaining.';
        throw new CustomUserMessageAuthenticationException($msg);
    }

    public function onLoginSuccess(LoginSuccessEvent $event): void
    {
        $user = $event->getUser();

        // Reset après succès (important)
        if (method_exists($user, 'setFailedAttempts') && method_exists($user, 'setIsBlocked')) {
            $user->setFailedAttempts(0);
            $user->setIsBlocked(false);
            $this->em->flush();
        }
    }
}