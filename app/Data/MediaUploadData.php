<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class MediaUploadData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $path,
        public readonly SignedUrlData $signedUrlData,
    ) {}
}
