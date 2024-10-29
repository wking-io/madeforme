<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SignedUploadData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $path,
        public readonly string $url,
        /**
         * @var array<string, mixed>
         */
        public readonly array $headers,
    ) {}
}
