<?php

namespace App\Data;

use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Attributes\Validation\ArrayType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\File;
use Spatie\LaravelData\Attributes\Validation\Image;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Mimes;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\RequiredWithout;
use Spatie\LaravelData\Attributes\Validation\Url;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class CreatePost extends Data
{
    public function __construct(
        public string $title,
        public string $description,
        public string $slug,

        #[Exists('sources', 'id')]
        public ?int $source_id,

        #[RequiredWithout('source_id'), Max(255)]
        public ?string $source_name,

        #[RequiredWithout('source_id'), Url]
        public ?string $source_url,

        #[Image, Mimes('jpg,jpeg,png,webm'), Max(2048)]
        public UploadedFile $preview_image,

        #[File, Mimes('mp4,webm'), Max(2048)]
        public UploadedFile $preview_video,

        #[Required(), ArrayType()]
        public array $media,
    ) {}
}
