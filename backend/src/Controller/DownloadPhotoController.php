<?php

namespace App\Controller;

use App\Entity\Photo;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;

class DownloadPhotoController extends AbstractController
{
    #[Route('/api/photos/{id}/download', name: 'download_photo', methods: ['GET'])]
    public function __invoke(Photo $photo): BinaryFileResponse
    {
        $filePath = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $photo->getFilename();

        return $this->file(
            $filePath,
            $photo->getOriginalName(),
            ResponseHeaderBag::DISPOSITION_ATTACHMENT
        );
    }
}