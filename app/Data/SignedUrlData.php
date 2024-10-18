<?php

namespace App\Data;

use Spatie\LaravelData\Data;

class SignedUrlData extends Data
{
    public function __construct(
        public readonly string $bucket,
        public readonly string $key,
        public readonly string $url,
        public readonly array $headers,
    ) {}
}
