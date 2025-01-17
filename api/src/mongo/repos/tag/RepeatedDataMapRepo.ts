import { injectable } from 'inversify';
import RepeatedDataMap from '../../models/tag/RepeatedDataMap';
import UnderRevisionControl from './abstractions/UnderRevisionControl';
import { IndexSpecification } from 'mongodb';

@injectable()
export default class RepeatedDataMapRepo extends UnderRevisionControl<RepeatedDataMap> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexSpecification[] = [
        {
            background: false,
            key: {
                ___persisting_id: 1,
                _revision_id: 1,
            },
            unique: true,
        },
    ];
}
