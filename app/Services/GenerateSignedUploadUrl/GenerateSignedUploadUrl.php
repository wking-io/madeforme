<?php

namespace App\Services\GenerateSignedUploadUrl;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class GenerateSignedUploadUrl
{
    public static function sign(UploadedFile $file): string
    {
        if (self::isLocal()) {
            return URL::temporarySignedRoute(
                $file->path(), now()->addMinutes(5)
            );
        }

        $driver = Storage::getDriver();

        // Flysystem V2+ doesn't allow direct access to adapter, so we need to invade instead.
        $adapter = invade($driver)->adapter;

        // Flysystem V2+ doesn't allow direct access to client, so we need to invade instead.
        $client = invade($adapter)->client;

        // Flysystem V2+ doesn't allow direct access to bucket, so we need to invade instead.
        $bucket = invade($adapter)->bucket;

        $fileType = $file->getMimeType();

        $command = $client->getCommand('putObject', array_filter([
            'Bucket' => $bucket,
            'Key' => $file->getClientOriginalName(),
            'ContentType' => $fileType,
            'AllowedHeaders' => ['content-type'],
            'AllowedMethods' => ['PUT'],
            'AllowedOrigins' => ['https://madeforme.test'],
        ]));

        return $client->createPresignedRequest(
            $command,
            '+5minutes'
        )->getUri();
    }

    public static function isLocal(): bool
    {
        return config('filesystems.default') === 'local';
    }
}
