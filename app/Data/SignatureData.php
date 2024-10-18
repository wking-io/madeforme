<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SignatureData extends Data
{
    public function __construct(
        public int $id,
        public string $path,
        public string $url,
    ) {}
}
