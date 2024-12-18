<?php

namespace App\Data\Base;

use App\Enums\MediaStatus;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MediaData extends Data
{
    public function __construct(
        public int $id,
        public string $path,
        public MediaStatus $status,
    ) {}
}
