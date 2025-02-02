import type { Participant, Room } from "common";
import { useState } from "react";
import { z } from "zod";

interface EstimatesFormProps {
	estimates: {
		risk: string;
		effort: string;
		uncertainty: string;
	};
	setEstimates: (estimates: {
		risk: string;
		effort: string;
		uncertainty: string;
	}) => void;
	submitEstimates: (
		room: Room | null,
		estimates: {
			risk: string;
			effort: string;
			uncertainty: string;
		},
	) => void;
	room: Room | null;
	socketId: string | undefined;
	participants: Participant[];
}

type ValidationErrors = {
	risk?: string;
	effort?: string;
	uncertainty?: string;
};

const estimateSchema = z.object({
	risk: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)), "Must be a number")
		.refine(
			(val) => Number(val) >= 1 && Number(val) <= 10,
			"Must be between 1 and 10",
		),
	effort: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)), "Must be a number")
		.refine(
			(val) => Number(val) >= 1 && Number(val) <= 10,
			"Must be between 1 and 10",
		),
	uncertainty: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)), "Must be a number")
		.refine(
			(val) => Number(val) >= 1 && Number(val) <= 10,
			"Must be between 1 and 10",
		),
});

const EstimatesInputs: React.FC<EstimatesFormProps> = ({
	estimates,
	setEstimates,
	submitEstimates,
	room,
	socketId,
	participants,
}) => {
	const [errors, setErrors] = useState<ValidationErrors>({});

	const validateAndSubmit = () => {
		try {
			estimateSchema.parse(estimates);
			submitEstimates(room, estimates);
			setErrors({});
		} catch (error) {
			if (error instanceof z.ZodError) {
				const formattedErrors: ValidationErrors = {};
				for (const err of error.errors) {
					if (err.path[0]) {
						formattedErrors[err.path[0] as keyof ValidationErrors] =
							err.message;
					}
				}
				setErrors(formattedErrors);
			}
		}
	};
	console.log("errors", errors);
	return (
		!participants.find((p) => p.id === socketId)?.submitted && (
			<div className="border-t border-gray-100 pt-6 flex flex-col gap-6">
				<h2 className="text-2xl font-bold self-center">Your Estimates</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
					<div>
						<input
							type="number"
							placeholder="Risk (1-10)"
							value={estimates.risk}
							onChange={(e) =>
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-expect-error
								setEstimates((prev) => ({
									...prev,
									risk: e.target.value,
								}))
							}
							className={`w-full text-right p-4 text-lg ${errors.risk ? "border border-red-500" : ""}`}
							min="1"
							max="10"
						/>
						{errors.risk && (
							<p className="text-red-500 text-right text-sm mt-1">
								{errors.risk}
							</p>
						)}
					</div>

					<div>
						<input
							type="number"
							placeholder="Effort (1-10)"
							value={estimates.effort}
							onChange={(e) =>
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-expect-error
								setEstimates((prev) => ({
									...prev,
									effort: e.target.value,
								}))
							}
							className={`w-full text-right p-4 text-lg ${errors.effort ? "border border-red-500" : ""}`}
							min="1"
							max="10"
						/>
						{errors.effort && (
							<p className="text-red-500 text-right text-sm mt-1">
								{errors.effort}
							</p>
						)}
					</div>

					<div>
						<input
							type="number"
							placeholder="Uncertainty (1-10)"
							value={estimates.uncertainty}
							onChange={(e) =>
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-expect-error
								setEstimates((prev) => ({
									...prev,
									uncertainty: e.target.value,
								}))
							}
							className={`w-full text-right p-4 text-lg ${errors.uncertainty ? "border border-red-500" : ""}`}
							min="1"
							max="10"
						/>
						{errors.uncertainty && (
							<p className="text-red-500 text-right text-sm mt-1">
								{errors.uncertainty}
							</p>
						)}
					</div>
				</div>
				<button
					type="button"
					onClick={validateAndSubmit}
					disabled={
						!estimates.risk || !estimates.effort || !estimates.uncertainty
					}
					className="apple-button text-lg self-end"
				>
					Submit Estimates
				</button>
			</div>
		)
	);
};

export default EstimatesInputs;
