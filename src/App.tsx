import {Component, createMemo, createResource, createSignal, For, Show} from 'solid-js';
import jobs from './data.json'
import iconUrl from './assets/images/icon-remove.svg?url';
import photosnap from './assets/images/photosnap.svg?url';
import manage from './assets/images/manage.svg?url';
import account from './assets/images/account.svg?url';
import myhome from './assets/images/myhome.svg?url';
import loopStudios from './assets/images/loop-studios.svg?url';
import faceit from './assets/images/faceit.svg?url';
import shortly from './assets/images/shortly.svg?url';
import insure from './assets/images/insure.svg?url';
import eyecam from './assets/images/eyecam-co.svg?url';
import airFilter from './assets/images/the-air-filter-company.svg?url';

const jobsLogos = [
  photosnap,
  manage,
  account,
  myhome,
  loopStudios,
  faceit,
  shortly,
  insure,
  eyecam,
  airFilter,
];


interface Job {
    id: number;
    company: string;
    logo: string;
    new: boolean;
    featured: boolean;
    position: string;
    role: string;
    level: string;
    postedAt: string;
    contract: string;
    location: string;
    languages: string[];
    tools: any[];
}

const [selectedFilters, setSelectedFilters] = createSignal(new Set<string>());

const Tag: Component<{ tag: string; isEditable: boolean }> = ({tag, isEditable}) => {

        const onClick = () => {
            setSelectedFilters(() => {
                const newFilters = new Set(selectedFilters());
                newFilters.add(tag);
                return newFilters;
            });
        };

        const remove = () => {
            setSelectedFilters(() => {
                const newFilters = new Set(selectedFilters());
                newFilters.delete(tag);
                return newFilters;
            });
        };

        return <div className={'tag-wrap'}>
            <button onClick={onClick} className={`tag ${isEditable ? 'editable' : ''}`}>{tag}</button>
            {isEditable && <button onClick={remove} className="tag-remove"><img src={iconUrl} alt="remove"/></button>}
        </div>;
    }
;

const createTag = (isEditable: boolean = false) => (tag: string) => <Tag tag={tag} isEditable={isEditable}/>

const JobCard: Component<{ job: Job }> = ({job}) => {
    const tags = [job.role, job.level, ...job.languages, ...job.tools]

    return <div className={`job card ${job.featured ? 'featured' : ''}`}>
        <div class={"logo"}>
                <img class={'company-logo'} src={jobsLogos[job.id - 1]} alt={job.company + ' logo'}/>
        </div>
        <div className="details">
            <div className="company-name-and-chips">
                <span className="company-name">{job.company}</span>
                <div className="chips">
                    <Show when={job.new}>
                        <div className="new chip uppercase">new!</div>
                    </Show>
                    <Show when={job.featured}>
                        <div className="featured chip uppercase">featured</div>
                    </Show>
                </div>
            </div>
            <div className="position">
                {job.position}
            </div>
            <div className="job-info">
                {job.postedAt} <span className="bullet">&bull;</span> {job.contract} <span
                className="bullet">&bull;</span> {job.location}
            </div>
        </div>
        <div className="tags">
            <For each={tags}>
                {createTag()}
            </For>
        </div>
    </div>;
}

const App: Component = () => {
    const createJobCard = (job: Job) => <JobCard job={job}/>;
    const filteredJobs = createMemo(() => {

        if (selectedFilters().size === 0) {
            return jobs;
        }

        return jobs.filter(job => {
            const jobValues = new Set();
            Object.values(job).forEach(value => {
                if (Array.isArray(value)) {
                    value.forEach(v => jobValues.add(v));
                } else {
                    jobValues.add(value);
                }
            });

            return Array.from(selectedFilters()).every(filter => jobValues.has(filter));

        });
    });


    return (
        <main class={'App'}>
            <header className="header"/>
            <div className="container">
                <Show when={selectedFilters().size > 0}>
                    <section className="filter-tab card">
                        <div className={'filter-tab-tags'}>
                            <For each={Array.from(selectedFilters())}>
                                {createTag(true)}
                            </For>
                        </div>
                        <button className={'text-button'} onClick={() => setSelectedFilters(new Set())}>Clear</button>
                    </section>
                </Show>
                <section className="jobs-list">
                    <For each={filteredJobs()}>
                        {createJobCard}
                    </For>
                </section>
            </div>
            <div className="attribution">
                Challenge by <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">Frontend
                Mentor</a>.
                Coded by <a href="#">Your Name Here</a>.
            </div>
        </main>
    );
};


export default App;
