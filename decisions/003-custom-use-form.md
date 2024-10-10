# Custom `useForm`

Inertia comes with a form helper called `useForm`. However, it requires controlled inputs. This is not best practice for React, but by itself is not a deal breaker. Then I ran into nested data and array data...typed nested object updates is not fun or clean.

So, I built my own version of the `useForm` hook that allows you to give control back to the DOM. Here is how it works:

-   No manual data updates
-   Data is pulled from the form element on submit and converted into a FormData instance.
-   FormData supports File, nested keys, and array values by default.
-   Can still reset using a key.

However, there were some compromises I needed to make and require some work still:

-   Typed error object, or at a minimum helpers to get data based on the key.
-   Saved state. I tore out the remember functionality since I don't need it, but ideally would be able to bring that back in.
