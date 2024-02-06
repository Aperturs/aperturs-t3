type Question = {
  index: number;
  question: string;
  description: string;
  answer: string;
  setAnswer: (index: number, answer: string) => void;
};

export default function QuestionCard({
  index,
  question,
  description,
  answer,
  setAnswer,
}: Question) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="shadow-blue-gray-900/5 rounded-lg p-4 shadow-xl">
      <h2 className="mb-2 text-lg font-medium">{question}</h2>
      <p className="mb-4 text-gray-600">{description}</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="answer" className="mb-2 block font-medium">
          Answer:
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(event) => setAnswer(index, event.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-400 bg-white px-4 py-2"
        />
      </form>
    </div>
  );
}
