<?php

namespace App\Controller\Admin;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserListController extends AbstractController
{
    #[Route('/api/admin/users', name: 'admin_users_list', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function __invoke(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();

        $data = [];

        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'pseudo' => $user->getPseudo(),
                'age' => $user->getAge(),
                'roles' => $user->getRoles(),
                'isBlocked' => $user->isBlocked(),
                'failedAttempts' => $user->getFailedAttempts(),
                'photosCount' => count($user->getPhotos()),
            ];
        }

        return $this->json($data);
    }
}