<?php

namespace App\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Photo;
use App\Repository\PhotoRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

class PhotoPublishOrderSubscriber implements EventSubscriberInterface
{
    public function __construct(private PhotoRepository $photoRepository)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['validatePublicOrder', EventPriorities::PRE_WRITE],
        ];
    }

    public function validatePublicOrder(ViewEvent $event): void
    {
        $photo = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$photo instanceof Photo) {
            return;
        }

        if (!in_array($method, ['POST', 'PUT', 'PATCH'], true)) {
            return;
        }

        if ($photo->getPublicOrder() === null) {
            return;
        }

        if ($photo->getUser() === null) {
            return;
        }

        $isUsed = $this->photoRepository->isPublicOrderUsedByUser(
            $photo->getUser(),
            $photo->getPublicOrder(),
            $photo->getId()
        );

        if ($isUsed) {
            throw new BadRequestHttpException('This public order is already used for another photo.');
        }
    }
}