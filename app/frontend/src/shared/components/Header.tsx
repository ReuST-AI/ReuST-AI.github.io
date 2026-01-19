import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-primary-600/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center space-x-4">
          <h1
            className="cursor-pointer text-3xl font-bold md:text-4xl"
            title="This user dashboard evaluates the reuse potential of existing steel structures considering the logistic feasibility, the structural visual inspection, and the structural performance. In addition, the user is provided with a simplified method to compute the life cycle assessment of any possible end-of-life scenario."
          >
            ReuST
          </h1>
          <div className="hidden h-12 w-px bg-gray-300 dark:bg-gray-600 md:block" />
          <p className="hidden max-w-2xl text-sm italic text-gray-600 dark:text-gray-300 md:block">
            A decision making framework for efficient end-of-life scenarios of structural steel
            elements
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
