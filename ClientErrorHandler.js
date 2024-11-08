
/**
 * ClientErrorHandler Class
 * 
 * This class is designed to capture front-end errors and send them to the server
 * for tracking and error mapping. It intercepts both runtime errors and unhandled
 * promise rejections, collects relevant information (including stack traces), 
 * and sends this data to a specified server endpoint for centralized error logging 
 * and analysis.
 * 
 * Usage:
 * 1. Instantiate ClientErrorHandler with `url` and `appName` properties.
 * 2. Call `clientErrorHandler()` to activate the error handlers.
 * 
 * Constructor Params:
 * - url (string): Server endpoint to receive error data.
 * - appName (string): Name of the application for error source identification.
 */
class ClientErrorHandler {
	constructor({ url, appName }) {
		this.url = url;
		this.appName = appName;
	}

	sendToServer = function ({ message, error, params }) {
		console.error(error);
		const { url, appName } = this;
		params = {
			stack: error?.stack ?? (error || message),
			appName,
			...params
		};
		fetch(url, {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify(params),
			credentials: 'include'
		});
	}

	onerror = (message, source, line, col, error) => {
		this.sendToServer({ message, error });
	}

	onunhandledrejection = (event) => {
		this.sendToServer({ message: event.reason?.message, error: event.reason });
	}

	clientErrorHandler = () => {

		window.onerror = this.onerror;
		window.onunhandledrejection = this.onunhandledrejection
		return () => {
			window.onerror = null;
			window.onunhandledrejection = null;
		};
	}
}

export default ClientErrorHandler;