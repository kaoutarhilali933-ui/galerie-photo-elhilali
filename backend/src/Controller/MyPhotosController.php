<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\PhotoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class MyPhotosController extends AbstractController
{
    public function __construct(private PhotoRepository $photoRepository)
    {
    }

    public function __invoke(#[CurrentUser] ?User $user): JsonResponse
    {
        if (!$user) {
            return $this->json(['message' => 'Authentication required.'], 401);
        }

        $photos = $this->photoRepository->findBy(
            ['user' => $user],
            ['uploadedAt' => 'DESC']
        );

        $data = [];

        foreach ($photos as $photo) {
            $data[] = [
                'id' => $photo->getId(),
                'filename' => $photo->getFilename(),
                'originalName' => $photo->getOriginalName(),
                'mimeType' => $photo->getMimeType(),
                'sizeBytes' => $photo->getSizeBytes(),
                'uploadedAt' => $photo->getUploadedAt()?->format('Y-m-d H:i:s'),
                'publicOrder' => $photo->getPublicOrder(),
                'category' => $photo->getCategory(),
                'visibility' => $photo->getVisibility(),
                'pseudo' => $photo->getUser()?->getPseudo(),
            ];
        }

        return $this->json($data);
    }
}