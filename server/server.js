exports = {
    async checkUserExists(context) {
        /**
         * Checks if a user exists by invoking a request template with the given context.
         * @param {Object} context - The context containing parameters needed to check if the user exists.
         * @returns {Promise<void>} - Returns a promise that resolves with the user data if found, or handles specific error code 400201 if the user is not found.
         */
        try {
            /**
             * Check if the user exists by invoking the corresponding template.
             */
            await invokeTemplate("checkUserExists", { context: context.params });
        } catch (e) {
            /**
             * Handle any errors that occur when checking for the user's existence.
             */
            const errorMessage = handleError(e.response);
            if (errorMessage === 'user_not_found') {
                /**
                 * If the user is not found, create a new user by invoking the corresponding template.
                 */
                $db.delete("sendbird_session_token");
                await invokeTemplate("createUser", { context: {}, body: JSON.stringify(context.params) });
            } else {
                /**
                 * If an error other than "user not found" occurs, render the error message.
                 */
                renderData(errorMessage);
            }
        }
    },
    /**
     * Retrieves the user session token by invoking a specific template.
     *
     * @async
     * @function getUserSessionToken
     * @param {Object} context - The context object containing necessary parameters.
     * @param {Object} context.params - The parameters needed to retrieve the session token.
     * @throws Will throw an error if the invocation of the template fails.
     * @returns {void} No return value, but side effects include rendering data or handling errors as needed.
     * @example
     *   const context = {
     *     params: {
     *       userId: "123",
     *       otherParam: "value"
     *     }
     *   };
     *   await getUserSessionToken(context);
     */
    async getUserSessionToken(context) {
        console.log("CONTEXT:", context)
        try {
            await invokeTemplate("getUserSessionToken", { context: context.params, body: JSON.stringify(context.params) });
        } catch (e) {
            const errorMessage = handleError(e.response);
            renderData(errorMessage);
        }
    }
}

/**
 * Invokes the specified template and handles the response, including logging and rendering the data.
 *
 * @param {string} template - The name of the template to invoke.
 * @param {Object} params - The parameters to pass to the template.
 * @throws Will throw an error if the request fails.
 */
const invokeTemplate = async (template, params = {}) => {
    try {
        const data = await $request.invokeTemplate(template, params);
        console.log(`SB Serverless: ${template} invoked successfully.`);
        console.log(`SB Serverless: ${template} response: ${JSON.stringify(data)}`);
        renderData(data);
    } catch (e) {
        console.log(`${template.toUpperCase()} ERROR:`, e);
        throw e;
    }
};

/**
 * Handles error response, checking for specific error code 400201 (User not found).
 * @param {string} errorResponse - The error response as a JSON string.
 * @returns {string|null} - Returns the error message with code if the specific error code 400201 is found, null otherwise.
 */
function handleError(errorResponse) {
    try {
        const parsedError = JSON.parse(errorResponse);
        if (parsedError.error === true) {
            if (parsedError.code === 400201) {
                return 'user_not_found';
            } else {
                return { error: true, message: `SB Serverless: ${errorResponse}` };
            }
        }
    } catch (parseError) {
        return { error: true, message: `SB Serverless: ${errorResponse}` };
    }
}






