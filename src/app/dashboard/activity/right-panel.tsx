type Priority = "High" | "Medium" | "Low";

type Project = {
  id: string;
  name: string;
  priority: Priority;
};

type RightPanelProps = {
  stats: {
    filesUploaded: number;
    tasksCompleted: number;
    messages: number;
  };
  projects: Project[];
};

const priorityDot: Record<Priority, string> = {
  High: "bg-rose-400",
  Medium: "bg-amber-400",
  Low: "bg-zinc-500",
};

export default function RightPanel({ stats, projects }: RightPanelProps) {
  const statItems = [
    { label: "Files", value: stats.filesUploaded },
    { label: "Done", value: stats.tasksCompleted },
    { label: "Messages", value: stats.messages },
  ];

  return (
    <aside className="w-full space-y-10 lg:w-72">
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">Overview</h2>

        <dl className="mt-4 grid grid-cols-3 gap-6">
          {statItems.map(({ label, value }) => (
            <div key={label}>
              <dd className="text-3xl font-light tabular-nums tracking-tight text-zinc-100">{value}</dd>
              <dt className="mt-1 text-xs text-zinc-500">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wider text-zinc-500">Projects</h2>
          <span className="text-xs tabular-nums text-zinc-600">{projects.length}</span>
        </div>

        {projects.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600">Nothing active right now.</p>
        ) : (
          <ul className="mt-4 divide-y divide-zinc-800/60">
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span
                  className="min-w-0 truncate text-sm text-zinc-200"
                  title={project.name}
                >
                  {project.name}
                </span>
                <span className="flex shrink-0 items-center gap-2 text-xs text-zinc-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${priorityDot[project.priority]}`} />
                  {project.priority}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
