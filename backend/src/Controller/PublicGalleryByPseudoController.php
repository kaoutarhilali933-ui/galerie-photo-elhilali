<?php

namespace App\Controller;

use App\Repository\PhotoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class PublicGalleryByPseudoController extends AbstractController
{
    public function __construct(private PhotoRepository $photoRepository)
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $pseudo = $request->attributes->get('pseudo') ?? $request->attributes->get('id');

        if (!$pseudo) {
            return $this->json([
                'message' => 'Pseudo is required.'
            ], 400);
        }

        $photos = $this->photoRepository->findPublicPhotosByPseudo($pseudo);

        if (!$photos) {
            return $this->json([
                'message' => 'No public photos found for this user.'
            ], 404);
        }

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