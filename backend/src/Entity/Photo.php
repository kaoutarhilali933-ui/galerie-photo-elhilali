<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\PhotoRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PhotoRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['photo:read']],
    denormalizationContext: ['groups' => ['photo:write']]
)]
class Photo
{

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['photo:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'photos')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['photo:read', 'photo:write'])]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    #[Groups(['photo:read', 'photo:write'])]
    private ?string $filename = null;

    #[ORM\Column(length: 255)]
    #[Groups(['photo:read', 'photo:write'])]
    private ?string $originalName = null;

    #[ORM\Column(length: 100)]
    #[Groups(['photo:read', 'photo:write'])]
    private ?string $mimeType = null;

    #[ORM\Column]
    #[Groups(['photo:read', 'photo:write'])]
    private ?int $sizeBytes = null;

    #[ORM\Column(type: 'datetime')]
    #[Groups(['photo:read'])]
    private ?\DateTimeInterface $uploadedAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['photo:read', 'photo:write'])]
    private ?int $publicOrder = null;


    // ===================== GETTERS / SETTERS =====================

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): static
    {
        $this->filename = $filename;
        return $this;
    }

    public function getOriginalName(): ?string
    {
        return $this->originalName;
    }

    public function setOriginalName(string $originalName): static
    {
        $this->originalName = $originalName;
        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): static
    {
        $this->mimeType = $mimeType;
        return $this;
    }

    public function getSizeBytes(): ?int
    {
        return $this->sizeBytes;
    }

    public function setSizeBytes(int $sizeBytes): static
    {
        $this->sizeBytes = $sizeBytes;
        return $this;
    }

    public function getUploadedAt(): ?\DateTimeInterface
    {
        return $this->uploadedAt;
    }

    public function setUploadedAt(\DateTimeInterface $uploadedAt): static
    {
        $this->uploadedAt = $uploadedAt;
        return $this;
    }

    public function getPublicOrder(): ?int
    {
        return $this->publicOrder;
    }

    public function setPublicOrder(?int $publicOrder): static
    {
        $this->publicOrder = $publicOrder;
        return $this;
    }
}