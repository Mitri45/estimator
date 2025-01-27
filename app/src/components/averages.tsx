import { ClipboardIcon } from "@radix-ui/react-icons";

interface AveragesProps {
	averages: {
		risk: number;
		effort: number;
		uncertainty: number;
		sum: number;
	};
}

const Averages: React.FC<AveragesProps> = ({ averages }) => {
	return (
		<div className="mb-8 p-6 rounded-xl bg-blue-50 border border-blue-100">
			<div className="flex items-center gap-2 mb-4 justify-center">
				<ClipboardIcon className="w-6 h-6 text-blue-500" />
				<h2 className="text-2xl font-semibold">Averages</h2>
			</div>
			<div className="grid grid-cols-4 gap-4 text-center">
				<div>
					<p className="text-lg text-gray-600">Risk</p>
					<p className="text-3xl font-semibold text-blue-600">
						{averages.risk}
					</p>
				</div>
				<div>
					<p className="text-lg text-gray-600">Effort</p>
					<p className="text-3xl font-semibold text-blue-600">
						{averages.effort}
					</p>
				</div>
				<div>
					<p className="text-lg text-gray-600">Uncertainty</p>
					<p className="text-3xl font-semibold text-blue-600">
						{averages.uncertainty}
					</p>
				</div>
				<div>
					<p className="text-lg text-gray-600">Sum</p>
					<p className="text-3xl font-semibold text-blue-600">{averages.sum}</p>
				</div>
			</div>
		</div>
	);
};

export default Averages;
