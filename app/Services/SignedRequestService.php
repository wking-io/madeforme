<?php

namespace App\Services;

use Aws\S3\S3Client;
use Psr\Http\Message\UriInterface;

class SignedRequestService
{
    protected array $disk;

    public function __construct()
    {
        $default = config('filesystems.default');
        $this->disk = config("filesystems.disks.{$default}");
    }

    public function handle(string $key, string $content_type, array $metadata = [], mixed $content_length = null): array
    {
        $expiresAfter = config('storage.uploads.url_expires_after', 60);

        $signedRequest = $this->client()->createPresignedRequest(
            $this->createCommand(
                key: $key,
                content_type: $content_type,
                metadata: $metadata,
            ),
            sprintf('+%s minutes', $expiresAfter),
        );

        $headers = $this->headers($signedRequest, $content_type, $content_length);

        return [
            'bucket' => data_get($this->disk, 'bucket'),
            'key' => $key,
            'url' => $this->buildUrl($signedRequest->getUri()),
            'headers' => $headers,
        ];
    }

    public function temporaryUrl(string $key): string
    {
        $signedRequest = $this->client()->createPresignedRequest(
            $this->client()->getCommand('GetObject', [
                'Bucket' => data_get($this->disk, 'bucket'),
                'Key' => $key,
            ]),
            sprintf('+%s minutes', 15)
        );

        return $this->buildUrl($signedRequest->getUri());
    }

    public function client(): S3Client
    {
        $config = [
            'region' => data_get($this->disk, 'region'),
            'version' => 'latest',
            'endpoint' => data_get($this->disk, 'endpoint'),
            'signature_version' => 'v4',
            'use_path_style_endpoint' => data_get($this->disk, 'use_path_style_endpoint', false),
        ];

        $config['credentials'] = array_filter([
            'key' => data_get($this->disk, 'key'),
            'secret' => data_get($this->disk, 'secret'),
            'token' => null,
        ]);

        return new S3Client($config);
    }

    protected function createCommand(string $key, string $content_type, array|string|null $metadata = null)
    {
        return $this->client()->getCommand('putObject', array_filter([
            'Bucket' => data_get($this->disk, 'bucket'),
            'Key' => $key,
            'ACL' => data_get($this->disk, 'visibility', 'private'),
            'ContentType' => $content_type,
            'CacheControl' => null,
            'Expires' => sprintf('+%s minutes', 15),
            'Metadata' => $metadata,
        ]));
    }

    /**
     * Get the headers that should be used when making the signed request.
     */
    protected function headers($signedRequest, string $content_type, mixed $content_length = null): array
    {
        return array_merge(
            $signedRequest->getHeaders(),
            array_filter([
                'Content-Type' => $content_type,
                'Content-Length' => $content_length,
            ])
        );
    }

    protected function buildUrl(UriInterface $uri): string
    {
        return $uri->getScheme().'://'.$uri->getAuthority().$uri->getPath().'?'.$uri->getQuery();
    }

    /**
     * Get key for the given UUID.
     */
    protected function getKey(string $uuid): string
    {
        return "tmp/$uuid";
    }
}
