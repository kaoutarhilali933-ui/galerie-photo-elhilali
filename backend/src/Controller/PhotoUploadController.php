<?php

namespace App\Controller;

use App\Entity\Photo;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class PhotoUploadController extends AbstractController
{
    public function __invoke(
        Request $request,
        EntityManagerInterface $entityManager,
        #[CurrentUser] ?User $user
    ): JsonResponse {
        if (!$user) {
            return new JsonResponse(['message' => 'Authentication required.'], 401);
        }

        $file = $request->files->get('file');

        if (!$file) {
            return new JsonResponse(['message' => 'No file uploaded.'], 400);
        }

        $allowedMimeTypes = ['image/jpeg', 'image/png'];
        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        $originalName = $file->getClientOriginalName();

        if (!in_array($mimeType, $allowedMimeTypes, true)) {
            return new JsonResponse(['message' => 'Only JPEG and PNG files are allowed.'], 400);
        }

        if ($size > 5 * 1024 * 1024) {
            return new JsonResponse(['message' => 'File size must not exceed 5 MB.'], 400);
        }

        $extension = $file->guessExtension() ?: 'bin';
        $newFilename = uniqid('', true) . '.' . $extension;

        try {
            $file->move(
                $this->getParameter('kernel.project_dir') . '/public/uploads',
                $newFilename
            );
        } catch (FileException $e) {
            return new JsonResponse([
                'message' => 'Failed to upload file.',
                'error' => $e->getMessage()
            ], 500);
        }

        $photo = new Photo();
        $photo->setUser($user);
        $photo->setFilename($newFilename);
        $photo->setOriginalName($originalName);
        $photo->setMimeType($mimeType);
        $photo->setSizeBytes($size);
        $photo->setUploadedAt(new \DateTime());
        $photo->setPublicOrder(null);

        $entityManager->persist($photo);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Photo uploaded successfully.',
            'photo' => [
                'id' => $photo->getId(),
                'filename' => $photo->getFilename(),
                'originalName' => $photo->getOriginalName(),
                'mimeType' => $photo->getMimeType(),
                'sizeBytes' => $photo->getSizeBytes(),
                'uploadedAt' => $photo->getUploadedAt()?->format('Y-m-d H:i:s'),
            ]
        ], 201);
    }
}