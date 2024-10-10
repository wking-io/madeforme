<?php

namespace App\Data;

use App\Enums\PostStatus;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PostSummary extends Data
{
    public function __construct(
        public int $id,
        public string $title,
        public string $description,
        public string $slug,
        public PostStatus $status,
        public Base\SourceData $source,
        /** @var Base\CategoryData[] */
        public array $categories,
    ) {}
}
