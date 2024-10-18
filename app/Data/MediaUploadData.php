<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MediaUploadData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly SignedUrlData $signedUrlData,
    ) {}
}
