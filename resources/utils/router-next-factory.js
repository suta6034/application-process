export default function routerNextFactory(context, middleware, index) {
    const subsequentMiddleware = middleware[index];
    if (!subsequentMiddleware) return context.next;

    return (...parameters) => {
        // If the middleware handles the request, run the default Vue Router
        // `next()` callback.
        if (parameters.length) {
            context.next(...parameters);
            return;
        }

        const nextMiddleware = routerNextFactory(context, middleware, index + 1);
        subsequentMiddleware({ ...context, next: nextMiddleware });
    };
}
