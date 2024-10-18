<?php

namespace App\Data;

use App\Enums\MediaStatus;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class MediaSummary extends Data
{
    public function __construct(
        public int $id,
        public string $path,
        public MediaStatus $status,
        public Lazy|Base\PostData $post,
    ) {}
}
