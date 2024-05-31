import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import z from 'zod'

const ax: AxiosInstance = axios.create({
	baseURL: getBaseURL(),
})

function getBaseURL(): string {
	try {
		return z
			.string()
			.parse(import.meta.env.VITE_API_URL)
			.valueOf()
	} catch {
		return ''
	}
}

export async function getIP(): Promise<string> {
	const config: AxiosRequestConfig = {
		url: `/ip`,
	}

	const schema = z.object({
		ip: z.string(),
	})

	const response = await ax.request(config)
	return schema.parse(response.data).ip
}

export async function checkPort(userInput: string): Promise<boolean> {
	const port = z.coerce.number().parse(userInput)

	const config: AxiosRequestConfig = {
		url: `/checkport`,
		params: {
			port,
		},
	}

	try {
		await ax.request(config)
		return true
	} catch {
		return false
	}
}
