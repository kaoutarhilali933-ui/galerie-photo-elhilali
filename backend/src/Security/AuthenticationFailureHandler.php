<?php

namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationFailureHandlerInterface;

class AuthenticationFailureHandler implements AuthenticationFailureHandlerInterface
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): JsonResponse
    {
        $data = json_decode($request->getContent() ?? '', true);
        $email = $data['email'] ?? null;

        if (!$email) {
            return new JsonResponse([
                'message' => 'Email is required.'
            ], 401);
        }

        $user = $this->userRepository->findOneBy(['email' => $email]);

        // ❗ cas : email inexistant
        if (!$user) {
            return new JsonResponse([
                'message' => 'Account does not exist.'
            ], 401);
        }

        // ❗ cas : compte bloqué
        if ($user->isBlocked()) {
            return new JsonResponse([
                'message' => 'Account blocked after 3 failed attempts.'
            ], 401);
        }

        $attempts = $user->getFailedAttempts();
        $remaining = 3 - $attempts;

        if ($remaining > 0) {
            return new JsonResponse([
                'message' => 'Invalid password. You have ' . $remaining . ' attempt' . ($remaining > 1 ? 's' : '') . ' left.'
            ], 401);
        }

        return new JsonResponse([
            'message' => 'Invalid email or password.'
        ], 401);
    }
}