<?php

namespace App\Http\Controllers;

use App\Data\SignedUploadData;
use App\Http\Requests\Media\ConfirmRequest;
use App\Http\Requests\Media\SignRequest;
use App\Models\Media;
use App\Services\SignedRequestService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MediaController extends Controller
{
    public function __construct(
        private readonly SignedRequestService $service
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $media = Media::all(['id', 'path', 'status']);

        return Inertia::render('media/index', [
            'media' => $media,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        return Inertia::render('media/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function sign(SignRequest $request)
    {

        $signedUrls = collect([]);

        collect($request->uploads)->each(function ($file) use ($signedUrls) {

            $signedUrlData = $this->service->handle(
                key: data_get($file, 'key'),
                content_type: data_get($file, 'type'),
                content_length: data_get($file, 'size'),
            );

            $media = Media::create([
                'path' => data_get($file, 'key'),
            ]);

            $signedUrls->push([
                'id' => $media->id,
                'key' => $signedUrlData['key'],
                'url' => $signedUrlData['url'],
                'headers' => $signedUrlData['headers'],
            ]);
        });

        return response()->json(SignedUploadData::collect($signedUrls));
    }

    /**
     * Display the specified resource.
     */
    public function show(
        Media $media
    ) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(
        Media $media
    ) {
        //
    }

    public function confirm(
        ConfirmRequest $request
    ) {
        Media::whereIn('id', $request->safe()->media)->update(['status' => 'confirmed']);

        return response()->json([
            'success' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        Media $media
    ) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(
        Media $media
    ) {
        //
    }
}
