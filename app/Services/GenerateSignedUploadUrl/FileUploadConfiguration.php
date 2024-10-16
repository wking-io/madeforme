<?php

namespace App\Services\GenerateSignedUploadUrl;

use Illuminate\Support\Facades\Storage;
use League\Flysystem\WhitespacePathNormalizer;

class FileUploadConfiguration
{
    public static function storage()
    {
        $disk = static::disk();

        if (app()->runningUnitTests()) {
            // We want to "fake" the first time in a test run, but not again because
            // Storage::fake() wipes the storage directory every time its called.
            rescue(
                // If the storage disk is not found (meaning it's the first time),
                // this will throw an error and trip the second callback.
                fn () => Storage::disk($disk),
                fn () => Storage::fake($disk),
                // swallows the error that is thrown on the first try
                report: false
            );
        }

        return Storage::disk($disk);
    }

    public static function disk()
    {
        if (app()->runningUnitTests()) {
            return 'tmp-for-tests';
        }

        return config('filesystems.default');
    }

    public static function diskConfig()
    {
        return config('filesystems.disks.'.static::disk());
    }

    public static function isUsingCloud()
    {
        $diskBeforeTestFake = config('filesystems.default');

        return in_array(config('filesystems.disks.'.strtolower($diskBeforeTestFake).'.driver'), ['s3', 'r2']);
    }

    public static function normalizeRelativePath($path)
    {
        return (new WhitespacePathNormalizer)->normalizePath($path);
    }

    public static function directory()
    {
        return static::normalizeRelativePath('media-tmp');
    }

    protected static function cloudRoot()
    {
        if (! static::isUsingCloud()) {
            return '';
        }

        $diskConfig = static::diskConfig();

        if (! is_array($diskConfig)) {
            return '';
        }

        $root = $diskConfig['root'] ?? null;

        return $root !== null ? static::normalizeRelativePath($root) : '';
    }

    public static function path($path = '', $withS3Root = true)
    {
        $prefix = $withS3Root ? static::cloudRoot() : '';
        $directory = static::directory();
        $path = static::normalizeRelativePath($path);

        return $prefix.($prefix ? '/' : '').$directory.($path ? '/' : '').$path;
    }
}
