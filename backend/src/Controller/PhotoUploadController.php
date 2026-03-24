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
use Symfony\Component\HttpFoundation\File\UploadedFile;

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

        if (!$file || !($file instanceof UploadedFile)) {
            return new JsonResponse(['message' => 'No file uploaded.'], 400);
        }

        if (!$file->isValid()) {
            return new JsonResponse([
                'message' => 'Uploaded file is invalid.',
                'error_code' => $file->getError()
            ], 400);
        }

        $originalName = $file->getClientOriginalName();
        $mimeType = $file->getMimeType();
        $size = $file->getSize();
        $extension = $file->guessExtension() ?: 'jpg';

        $newFilename = uniqid('', true) . '.' . $extension;

        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads';

        try {
            $file->move($uploadDir, $newFilename);
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

        // Valeurs par défaut pour ne pas casser la galerie publique
        $photo->setVisibility('Public');
        $photo->setCategory('Other');

        $entityManager->persist($photo);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Photo uploaded successfully',
            'photo' => [
                'id' => $photo->getId(),
                'filename' => $photo->getFilename(),
                'originalName' => $photo->getOriginalName(),
                'size' => $photo->getSizeBytes(),
                'uploadedAt' => $photo->getUploadedAt()->format('Y-m-d H:i:s'),
                'visibility' => $photo->getVisibility(),
                'category' => $photo->getCategory(),
                'pseudo' => $photo->getUser()?->getPseudo(),
            ]
        ], 201);
    }
}