import { Check, CheckCheck, Cloud, CodeXml, Database, GitBranch, PanelsTopLeft, Plus, ArrowRight, ShieldCheck, Wrench } from "lucide-react";
import { Header, Hero, Flow, ContributionIndex, Contact } from "@/components/portfolio-interactions";
import { contributions, education, experience, principles, toolGroups } from "@/lib/portfolio-content";

function ContributionDetails({ item }: { item: typeof contributions[number] }) {
  return <details className="contribution-disclosure">
    <summary className="detail-button">View contribution <Plus size={18} aria-hidden="true" /></summary>
    <div className="contribution-details">
      {item.details.map(detail => <div key={detail.heading}><h4>{detail.heading}</h4><p>{detail.body}</p></div>)}
      <p className="contribution-attribution">Professional contribution at Lowe’s.</p>
    </div>
  </details>;
}

function WorkStory({ index, featured = false }: { index: number; featured?: boolean }) {
  const item = contributions[index];
  return <article id={"contribution-" + index} className={"work-anchor work-story " + (featured ? "featured-story" : "compact-story")}>
    <div className="story-heading">
      <div className="story-meta"><span>{item.year}</span><span>{item.category}</span></div>
      <h3>{item.shortTitle}</h3>
    </div>
    <p className="story-summary">{item.summary}</p>
    <dl className="work-evidence">
      <div><dt>My role</dt><dd>{item.role}</dd></div>
      <div><dt>Outcome</dt><dd>{item.outcome}</dd></div>
    </dl>
    {featured && <Flow kind={index === 0 ? "enterprise" : "analytics"} />}
    <p className="work-tools">{item.tags.join(" · ")}</p>
    <ContributionDetails item={item} />
  </article>;
}

function SelectedWork() {
  return <section id="work" className="section work-section" aria-labelledby="work-heading" tabIndex={-1}>
    <div className="section-container">
      <div className="section-heading"><h2 id="work-heading">Selected work<span className="accent-heading">.</span></h2><p>Professional contributions, delivered in 2025 and 2026.</p></div>
      <ContributionIndex items={[0, 2, 1, 3].map(index => ({ index, title: contributions[index].shortTitle }))} />
      <div className="featured-work"><WorkStory index={0} featured /><WorkStory index={2} featured /></div>
      <div className="supporting-work"><WorkStory index={1} /><WorkStory index={3} /></div>
    </div>
  </section>;
}

function Experience() {
  return <section id="experience" className="section experience-section" aria-labelledby="experience-heading">
    <div className="section-container">
      <h2 id="experience-heading">Experience that compounds<span className="accent-heading">.</span></h2>
      <div className="experience-layout">
        <div className="experience-timeline" aria-label="Professional experience">
          {experience.map((role, index) => <article className={"timeline-entry " + (index === 0 ? "current-role" : "")} key={role.date}>
            <span className="timeline-node" aria-hidden="true" />
            <p className="role-date">{role.date}</p>
            <div className="role-content"><p className="role-employer">{role.employer}</p><h3>{role.title}</h3><p className="role-team">{role.team}</p><p className="role-summary">{role.summary}</p></div>
          </article>)}
        </div>
        <aside className="education-list" aria-labelledby="education-heading">
          <h3 id="education-heading">Continuing to learn.</h3>
          {education.map(degree => <article className="education-note" key={degree.degree}>
            <h4>{degree.degree}</h4>{degree.concentration && <p className="education-concentration">{degree.concentration}</p>}<p>{degree.school}</p><p className="education-date">{degree.dates}</p>
          </article>)}
        </aside>
      </div>
    </div>
  </section>;
}

function Approach() {
  const decisions = [
    { title: "Clarity before action.", body: "People should understand what an action will do and have the opportunity to review consequential changes.", flow: ["Understand intent", "Review the action", "Confirm"], note: "A design principle: clear intent and understandable feedback." },
    { title: "Measure the interaction.", body: "A component can render many times. Analytics should record the intended interaction without counting that same event again.", flow: ["Observe", "Deduplicate", "Record"], note: "Cleaner event data makes engagement reporting more trustworthy." },
  ];
  return <section id="approach" className="section approach-section" aria-labelledby="approach-heading">
    <div className="section-container">
      <div className="section-heading"><h2 id="approach-heading">Designed for the real world<span className="accent-heading">.</span></h2><p>The decisions beneath the interface matter.</p></div>
      <div className="decision-list">
        {decisions.map(decision => <article className="decision-band" key={decision.title}>
          <div><h3>{decision.title}</h3><p>{decision.body}</p></div>
          <div className="decision-diagram"><ol>{decision.flow.map((step, index) => <li key={step}>{index > 0 && <ArrowRight size={17} aria-hidden="true" />}<span>{step}</span></li>)}</ol><p>{decision.note}</p><span className="diagram-caption">Illustrative flow</span></div>
        </article>)}
      </div>
      <ul className="principle-ledger">{principles.map(principle => <li key={principle.title}><Check size={16} aria-hidden="true" />{principle.title}</li>)}</ul>
    </div>
  </section>;
}

function Stack() {
  const icons = { frontend: PanelsTopLeft, backend: CodeXml, data: Database, ai: GitBranch, identity: ShieldCheck, cloud: Cloud, quality: CheckCheck, tools: Wrench };
  return <section id="stack" className="section stack-section" aria-labelledby="stack-heading">
    <div className="section-container stack-layout">
      <div><h2 id="stack-heading">Tools,<br />with purpose<span className="accent-heading">.</span></h2><p className="section-description">Chosen for the work they enable.</p></div>
      <div className="capability-ledger">{toolGroups.map(group => {
        const Icon = icons[group.id];
        return <article className="capability-row" key={group.id}><Icon size={27} strokeWidth={1.5} aria-hidden="true" /><div><h3>{group.title}</h3><ul className="tool-list">{group.tools.map(tool => <li key={tool}>{tool}</li>)}</ul></div><p>{group.description}</p></article>;
      })}</div>
    </div>
  </section>;
}

export default function Home() {
  return <><a className="skip-link" href="#work">Skip to selected work</a><Header /><main><Hero /><SelectedWork /><Experience /><Approach /><Stack /><Contact /></main></>;
}
