<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserPasswordHasherProcessor implements ProcessorInterface
{
    private ProcessorInterface $processor;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(
        ProcessorInterface $processor,
        UserPasswordHasherInterface $passwordHasher
    ) {
        $this->processor = $processor;
        $this->passwordHasher = $passwordHasher;
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof User && $data->getPassword()) {

            $hashedPassword = $this->passwordHasher->hashPassword(
                $data,
                $data->getPassword()
            );

            $data->setPassword($hashedPassword);
        }

        return $this->processor->process($data, $operation, $uriVariables, $context);
    }
}
