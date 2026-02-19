interface Props {
  headline: string;
}

export const PersonaInsightsCard = ({
  headline,
}: Props) => {
  return (
    <div className="bg-zinc-900 rounded-2xl p-4">
      <h3 className="text-sm opacity-70">
        Persona Insight
      </h3>
      <p className="mt-2 text-lg font-semibold">
        {headline}
      </p>
    </div>
  );
};
