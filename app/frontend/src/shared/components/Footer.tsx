export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 dark:border-gray-700 dark:bg-primary-600">
      <div className="mx-auto max-w-7xl px-4 text-center md:px-8">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Contact:{' '}
          <a
            href="mailto:alper.kanyilmaz@polimi.it"
            className="text-accent-light hover:underline dark:text-accent-dark"
          >
            alper.kanyilmaz@polimi.it
          </a>
        </p>
      </div>
    </footer>
  );
}
