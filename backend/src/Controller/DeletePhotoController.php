<?php

namespace App\Controller;

use App\Entity\Photo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class DeletePhotoController extends AbstractController
{
    public function __invoke(
        Photo $photo,
        EntityManagerInterface $entityManager,
        ParameterBagInterface $params
    ): JsonResponse {
        $currentUser = $this->getUser();

        if (!$currentUser) {
            throw new AccessDeniedHttpException('You must be logged in to delete a photo.');
        }

        if ($photo->getUser()?->getId() !== $currentUser->getId()) {
            throw new AccessDeniedHttpException('You are not allowed to delete this photo.');
        }

        $filePath = $params->get('kernel.project_dir') . '/public/uploads/' . $photo->getFilename();

        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $entityManager->remove($photo);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Photo deleted successfully.'
        ], 200);
    }
}