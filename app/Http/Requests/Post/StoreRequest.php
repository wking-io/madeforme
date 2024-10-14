<?php

namespace App\Http\Requests\Post;

use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Support\ValidatedInput;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isKing(); // or implement your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'slug' => ['required', 'string', 'alpha_dash:ascii', 'max:255', Rule::unique(Post::class, 'slug')],
            'source.id' => ['nullable', 'exists:sources,id'],
            'source.name' => ['required_without:source.id', 'nullable', 'string', 'max:255'],
            'source.url' => ['required_without:source.id', 'nullable', 'url'],
            'preview_image' => ['required', 'image', 'mimes:webp', 'max:2048'],
            'preview_video' => ['required', 'file', 'mimes:webm', 'max:5120'],
            'media' => ['required', 'array'],
            'media.*' => ['required', 'file', 'mimes:webp,webm', 'max:5120'],
            'categories' => ['required', 'array'],
            'categories.*.id' => ['nullable', 'exists:categories,id'],
            'categories.*.name' => ['required_without:categories.*.id', 'nullable', 'string', 'max:255'],
            'categories.*.slug' => ['required_without:categories.*.id', 'nullable', 'string', 'alpha_dash:ascii', 'max:255', Rule::unique('categories', 'slug')],
        ];
    }

    public function postPayload(): array|ValidatedInput
    {
        return $this->safe(['title', 'description', 'slug']);
    }

    public function sourceId(): ?int
    {
        return $this->safe()->source['id'];
    }

    public function sourcePayload(): array|ValidatedInput
    {
        $newSource = $this->safe()->source;
        $newSource['slug'] = Str::slug($newSource['name']);

        return $newSource;
    }

    public function previewImagePayload()
    {
        return once(fn () => [
            'path' => $this->safe()->preview_image->store('posts'),
        ]);
    }

    public function previewVideoPayload()
    {
        return once(fn () => [
            'path' => $this->safe()->preview_video->store('posts'),
        ]);
    }

    public function mediaPayload($media)
    {
        return once(fn () => [
            'path' => $media->store('posts'),
        ]);
    }
}
