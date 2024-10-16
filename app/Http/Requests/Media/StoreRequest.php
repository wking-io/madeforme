<?php

namespace App\Http\Requests\Media;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\ValidatedInput;

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
            'name' => ['required', 'string', 'max:255'],
            'size' => ['required', 'number'],
            'type' => ['required', 'string', 'max:255'],
        ];
    }

    public function payload(): array|ValidatedInput
    {
        $payload = $this->safe(['name', 'type']);
        $payload['size'] = $this->safe()->size / 1024;

        return $payload;
    }
}
