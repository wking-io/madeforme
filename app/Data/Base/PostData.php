<?php

namespace App\Data\Base;

use App\Enums\PostStatus;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PostData extends Data
{
    public function __construct(
        public int $id,
        public string $title,
        public string $description,
        public string $slug,
        public PostStatus $status,
    ) {}
}
