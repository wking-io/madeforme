<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SignedUrlData extends Data
{
    public function __construct(
        public readonly string $bucket,
        public readonly string $key,
        public readonly string $url,
        /**
         * @var array<string, mixed>
         */
        public readonly array $headers,
    ) {}
}
