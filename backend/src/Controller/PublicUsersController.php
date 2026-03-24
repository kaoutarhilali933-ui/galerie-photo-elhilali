<?php

namespace App\Controller;

use App\Repository\PhotoRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class PublicUsersController extends AbstractController
{
    public function __construct(private PhotoRepository $photoRepository)
    {
    }

    public function __invoke(): JsonResponse
    {
        $users = $this->photoRepository->findPublicUsers();

        return $this->json($users);
    }
}