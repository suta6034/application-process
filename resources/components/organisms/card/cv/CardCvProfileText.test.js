import CardCvProfileText from './CardCvProfileText';

import {
    mount,
} from '../../../../../tests/app/vue/utils';
import {
    // eslint-disable-next-line import/named
    __createMocks as createStoreMocks,
} from '../../../../store';

jest.mock('../../../../store');
jest.mock('../../../../store/modules/profile');

const storeMocks = createStoreMocks();

storeMocks.store.state.profile.profileText = {
    profileText: 'Ich bin eine kreative Person mit Freitext.',
};

describe('CardCvProfileText', () => {
    function wrapperFactory() {
        return mount(CardCvProfileText, {
            store: storeMocks.store,
        });
    }

    test('It should render a `<appcard-stub>`.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.element.tagName).toBe('DIV');
    });

    test('It should render the profile text.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.contains('[data-qa="profile text"]')).toBe(true);
    });

    test('It should not show the read more button when there are less than 368 chars in the profile text.', () => {
        const wrapper = wrapperFactory();

        expect(wrapper.contains('[data-qa="profile text"]')).toBe(true);
        expect(wrapper.contains('[data-qa="read more"]')).toBe(false);
    });

    test('It should show the full profile text when the read more button gets triggert.', async () => {
        const wrapper = wrapperFactory();
        storeMocks.store.state.profile.profileText = {
            // eslint-disable-next-line max-len
            profileText: 'Überall dieselbe alte Leier. Das Layout ist fertig, der Text lässt auf sich warten. Damit das Layout nun nicht nackt im Raume steht und sich klein und leer vorkommt, springe ich ein: der Blindtext. Genau zu diesem Zwecke erschaffen, immer im Schatten meines großen Bruders »Lorem Ipsum«, freue ich mich jedes Mal, wenn Sie ein paar Zeilen lesen. Denn esse est percipi - Sein ist wahrgenommen werden.',
        };
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="profile text"]')).toBe(true);

        wrapper.find('[data-qa="read more"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="full profile text"]')).toBe(true);
    });

    test('It should show the truncated profile text when the read less button gets triggert.', async () => {
        const wrapper = wrapperFactory();
        storeMocks.store.state.profile.profileText = {
            // eslint-disable-next-line max-len
            profileText: 'Überall dieselbe alte Leier. Das Layout ist fertig, der Text lässt auf sich warten. Damit das Layout nun nicht nackt im Raume steht und sich klein und leer vorkommt, springe ich ein: der Blindtext. Genau zu diesem Zwecke erschaffen, immer im Schatten meines großen Bruders »Lorem Ipsum«, freue ich mich jedes Mal, wenn Sie ein paar Zeilen lesen. Denn esse est percipi - Sein ist wahrgenommen werden.',
        };

        wrapper.setData({ showMore: true });
        await wrapper.vm.$nextTick();
        wrapper.find('[data-qa="read less"]').trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="full profile text"]')).toBe(false);
        expect(wrapper.contains('[data-qa="profile text"]')).toBe(true);
    });

    test('It should show the read all button when the full profile text has more than 2000 characters.', async () => {
        const wrapper = wrapperFactory();
        storeMocks.store.state.profile.profileText = {
            // eslint-disable-next-line max-len
            profileText: 'Überall dieselbe alte Leier. Das Layout ist fertig, der Text lässt auf sich warten. '
            + 'Damit das Layout nun nicht nackt im Raume steht und sich klein und leer vorkommt, springe ich ein: der '
            + 'Blindtext. Genau zu diesem Zwecke erschaffen, immer im Schatten meines großen Bruders »Lorem Ipsum«, '
            + 'freue ich mich jedes Mal, wenn Sie ein paar Zeilen lesen. Denn esse est percipi - Sein ist wahrgenommen'
            + ' werden. Und weil Sie nun schon die Güte haben, mich ein paar weitere Sätze lang zu begleiten, möchte '
            + 'ich diese Gelegenheit nutzen, Ihnen nicht nur als Lückenfüller zu dienen, sondern auf etwas '
            + 'hinzuweisen, das es ebenso verdient wahrgenommen zu werden: Webstandards nämlich. Sehen Sie, '
            + 'Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS, JavaScript'
            + ' oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört haben. Diese Standard'
            + ' sorgen dafür, dass alle Beteiligten aus einer Webseite den größten Nutzen ziehen. Im Gegensatz zu'
            + ' früheren Webseiten müssen wir zum Beispiel nicht mehr zwei verschiedene Webseiten für den Internet'
            + ' Explorer und einen anderen Browser programmieren. Es reicht eine Seite, die - richtig angelegt - sowohl'
            + ' auf verschiedenen Browsern im Netz funktioniert, aber ebenso gut für den Ausdruck oder die Darstellung'
            + ' auf einem Handy geeignet ist. Wohlgemerkt: Eine Seite für alle Formate. Was für eine Erleichterung.'
            + '# Standards sparen Zeit bei den Entwicklungskosten und sorgen dafür, dass sich Webseiten später'
            + ' leichter pflegen lassen. Natürlich nur dann, wenn sich alle an diese Standards halten. Das gilt für'
            + ' Browser wie Firefox, Opera, Safari und den Internet Explorer ebenso wie für die Darstellung in Handys.'
            + ' Und was können Sie für Standards tun? Fordern Sie von Ihren Designern und Programmieren einfach '
            + 'standardkonforme Webseiten. Ihr Budget wird es Ihnen auf Dauer danken. Ebenso möchte ich Ihnen dafür'
            + ' danken, dass Sie mich bis zum Ende gelesen haben. Meine Mission ist erfüllt. Ich werde hier noch die'
            + ' Stellung halten, bis der geplante Text eintrifft. Ich wünsche Ihnen noch einen schönen Tag. Und arbeit'
            + 'en Sie nicht zuviel! Überall dieselbe alte Leier. Das Layout ist fertig, der Text lässt auf sich wart'
            + 'en. Damit das Layout nun nicht nackt im Raume steht und sich klein und leer vorkommt, springe ich ei'
            + 'n: der Blindtext. Genau zu diesem Zwecke erschaffen, immer im Schatten meines großen Bruders'
            + ' »Lorem Ipsum«, freue ich mich jedes Mal, wenn Sie ein paar Zeilen lesen. Denn esse est percipi - '
            + 'Sein ist wahrgenommen werden. Und weil Sie nun schon die Güte haben, mich ein paar weitere Sätze l'
            + 'ang zu begleiten, möchte ich diese Gelegenheit nutzen, Ihnen nicht nur als Lückenfüller zu dienen, '
            + 'sondern auf etwas hinzuweisen, das es ebenso verdient wahrgenommen zu werden: Webstandards nämlich. Seh'
            + 'en Sie, Webstandards sind das Regelwerk, auf dem Webseiten aufbauen. So gibt es Regeln für HTML, CSS,'
            + ' JavaScript oder auch XML; Worte, die Sie vielleicht schon einmal von Ihrem Entwickler gehört habe a'
            + 'n. Diese Standards so',
        };

        wrapper.setData({ showMore: false });

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="read all"]')).toBe(true);
    });

    test('It should render the empty state.', async () => {
        const wrapper = wrapperFactory();
        storeMocks.store.state.profile.profileText = {
            profileText: '',
        };

        await wrapper.vm.$nextTick();

        expect(wrapper.contains('[data-qa="profile text"]')).toBe(false);
        expect(wrapper.contains('[data-qa="empty state"]')).toBe(true);
    });
});
