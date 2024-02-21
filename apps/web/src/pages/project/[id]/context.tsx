import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

import QuestionCard from "~/components/projects/project/context/questionCard";
import { api } from "~/utils/api";

const ProjectContext = () => {
  useEffect(() => {
    toast(
      (t) => (
        <div className="flex flex-col">
          <span>
            The questions below are optional. You can answer them if you want to
            share more about your project. It will help our AI to generate a
            better post for you.
          </span>
          <button
            className="btn mt-2 rounded-lg bg-gray-300 px-4"
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </div>
      ),
      {
        duration: 4000,
      },
    );
  }, []);

  const [questionsNanswers, setQuestionsAnswer] = useState([
    {
      question: "What inspired you to start this project?",
      description:
        "We want to know what motivated you to create this project. Is there a story behind it? Did you identify a problem that needed to be solved? Share your inspiration and what led you to start this project.",
      answer: "",
    },
    {
      question:
        "What are some of the key challenges you faced while developing this project?",
      description:
        "We understand that developing a project can come with its own set of challenges. We want to know what specific challenges you faced while developing this project. Did you encounter any technical issues? How did you overcome them?",
      answer: "",
    },
    {
      question: "What are some of the unique features of this project?",
      description:
        "We want to know what sets your project apart from others. What are some of the unique features that you have included? What makes your project stand out?",
      answer: "",
    },
    {
      question: "Who do you see as the primary users of this project?",
      description:
        "We want to know who your project is intended for. Who are the primary users? What needs does your project solve for them?",
      answer: "",
    },
    {
      question: "What was your process for testing and quality assurance?",
      description:
        "We want to know how you ensured your project was of high quality. What was your testing process like? What tools did you use to ensure quality?",
      answer: "",
    },
    {
      question:
        "What was your biggest learning experience while working on this project?",
      description:
        "We want to know what you learned while working on this project. Did you learn any new skills? Did you encounter any surprises? Share your biggest learning experience.",
      answer: "",
    },
    {
      question: "What was your deployment strategy for this project?",
      description:
        "We want to know how you deployed your project. What was your strategy like? Did you use any specific tools or services?",
      answer: "",
    },
    {
      question:
        "What are some of the risks associated with this project, and how did you mitigate them?",
      description:
        "We want to know what risks you identified while working on this project. How did you mitigate them? What steps did you take to ensure the success of the project?",
      answer: "",
    },
    {
      question: "What is your vision for the future of this project?",
      description:
        "We want to know what your plans are for the future of this project. Do you plan to add more features? Are there any improvements you would like to make?",
      answer: "",
    },
    {
      question:
        "What was the most exciting part of working on this project for you?",
      description:
        "We want to know what you enjoyed the most while working on this project. Was there a specific feature or aspect that you found particularly exciting? Share your experience with us.",
      answer: "",
    },
  ]);

  const router = useRouter();
  const setAnswer = (index: number, answer: string) => {
    const newQuestions = questionsNanswers.map((q, i) => {
      if (i === index) {
        return { ...q, answer };
      }
      return q;
    });
    setQuestionsAnswer(newQuestions);
  };
  const { mutateAsync: updateContext } =
    api.github.project.updateProject.useMutation();
  const submit = async () => {
    const id = router.query.id;
    if (!id) return;
    const finalResponse = questionsNanswers.map(({ answer, question }) => {
      return { question, answer };
    });
    await toast
      .promise(
        updateContext({
          data: {
            questionsAnswersJsonString: finalResponse,
          },
          id: id.toString(),
        }),
        {
          loading: "Submitting...",
          success: "Submitted successfully",
          error: "Something went wrong",
        },
      )
      .then(async () => {
        await router.push(`/project/${router.query.id as string}/commits`);
      });
  };
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {questionsNanswers.map((q, index) => (
          <QuestionCard
            index={index}
            setAnswer={setAnswer}
            key={q.question}
            question={q.question}
            answer={q.answer}
            description={q.description}
          />
        ))}
      </div>
      <button
        onClick={async () => {
          await submit();
        }}
        className=" btn btn-primary mt-4 rounded-lg px-6 py-2 text-white"
      >
        Submit
      </button>
    </div>
  );
};

// ProjectContext.getLayout = function getLayout(page: ReactElement) {
//   return (
//     <Layout>
//       <ProjectLayout
//         params={{
//           id: "",
//         }}
//       >
//         {page}
//       </ProjectLayout>
//     </Layout>
//   );
// };

export default ProjectContext;
