import { AuthResponse, LoginPayload, RegisterPayload } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ERROR_MESSAGES: Record<string, string> = {
	"User already exists": "E-mail já cadastrado.",
	"User not found": "Usuário não encontrado.",
	"User unauthorized": "E-mail ou senha incorretos.",
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
	const response = await fetch(`${API_URL}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(ERROR_MESSAGES[error.message] ?? "Credenciais inválidas.");
	}

	return response.json();
}

export async function register(
	payload: RegisterPayload,
): Promise<{ message: string }> {
	const response = await fetch(`${API_URL}/auth/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(ERROR_MESSAGES[error.message] ?? "Erro ao criar conta.");
	}

	return response.json();
}
