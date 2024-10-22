<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\ValidatedInput;

class SignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->is_admin; // or implement your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'uploads' => ['required', 'array'],
            'uploads.*.key' => ['required', 'string', 'max:255'],
            'uploads.*.size' => ['required', 'numeric'],
            'uploads.*.type' => ['required', 'string', 'max:255'],
        ];
    }

    public function withEachUpload(callable $callback): array|ValidatedInput
    {
        $results = [];

        foreach ($this->safe()->uploads as $upload) {
            $results[$upload['key']] = $callback($upload);
        }

        return $results;
    }
}
