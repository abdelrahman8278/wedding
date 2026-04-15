import { supabase } from '@/lib/supabase'
import InvitationView from '@/components/InvitationView'

export default async function Page({ params }: { params: { slug: string } }) {

    const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (error || !data) {
        return <div className="text-center mt-10">Invitation Not Found</div>
    }

    return <InvitationView data={data} />
}