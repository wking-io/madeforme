<?php

namespace App\Services\GenerateSignedUploadUrl;

class FileNotPreviewableException extends \Exception
{
    public function __construct(TemporaryUploadedFile $file)
    {
        parent::__construct(
            "File with extension \"{$file->guessExtension()}\" is not previewable. See the livewire.temporary_file_upload.preview_mimes config."
        );
    }
}
