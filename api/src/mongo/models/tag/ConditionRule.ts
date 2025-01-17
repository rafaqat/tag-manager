import Model from '../../abstractions/Model';
import Field from '../../decorators/Field';
import { ObjectID } from 'mongodb';
import PlatformDataContainer from './PlatformDataContainer';
import ValidationError from '../../../errors/ValidationError';
import PlatformDataMap from './PlatformDataMap';
import Revision from './Revision';
import userMessages from '../../../errors/UserMessages';
import { ConditionType } from '../../../enums/ConditionType';
import { DataMapValue } from '../../../../../common/types/Types';

export default class ConditionRule extends Model {
    public getOrgEntityId(): ObjectID {
        return this.orgId;
    }

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'org_id',
    })
    private readonly _org_id!: ObjectID;

    @Field<string>({
        required: true,
        exposeToGQLAs: 'name',
        exposeToConfig: true,
    })
    private readonly _name: string;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'tag_manager_account_id',
    })
    private readonly _tag_manager_account_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'app_id',
    })
    private readonly _app_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'revision_id',
    })
    private readonly _revision_id!: ObjectID;

    @Field<ObjectID>({
        required: true,
        exposeToGQLAs: 'platform_data_container_id',
        platformInstance: () => PlatformDataContainer,
        exposeToConfig: true,
    })
    private _platform_data_container_id!: ObjectID;

    @Field<string | ObjectID>({
        required: true,
        exposeToGQLAs: 'match',
        platformInstance: (_) => (_ instanceof ObjectID ? PlatformDataMap : null),
        exposeToConfig: true,
    })
    private _match!: string | ObjectID;

    @Field<ConditionType>({
        required: false,
        exposeToGQLAs: 'match_key',
        exposeToConfig: true,
    })
    private _match_key?: string;

    @Field<ConditionType>({
        required: true,
        exposeToGQLAs: 'match_condition',
        exposeToConfig: true,
    })
    private _match_condition: ConditionType;

    @Field<DataMapValue>({
        required: true,
        exposeToGQLAs: 'match_value',
        exposeToConfig: true,
    })
    private _match_value: DataMapValue;

    constructor(
        name: string,
        revision: Revision,
        platformDataContainer: PlatformDataContainer,
        match: string | PlatformDataMap,
        matchCondition: ConditionType,
        matchValue: DataMapValue,
        matchKey?: string,
    ) {
        super();
        this._name = name;
        if (revision !== undefined) {
            this._org_id = revision.orgId;
            this._tag_manager_account_id = revision.tagManagerAccountId;
            this._app_id = revision.appId;
            this._revision_id = revision.id;
            this.updateMatch(platformDataContainer, match);
        }
        this._match_condition = matchCondition;
        this._match_value = matchValue;
        this._match_key = matchKey;
    }

    get orgId(): ObjectID {
        return this._org_id;
    }

    get name(): string {
        return this._name;
    }

    get tagManagerAccountId(): ObjectID {
        return this._tag_manager_account_id;
    }

    get appId(): ObjectID {
        return this._app_id;
    }

    get revisionId(): ObjectID {
        return this._revision_id;
    }

    get match(): string | ObjectID {
        return this._match;
    }

    get matchKey(): string | undefined {
        return this._match_key;
    }

    set matchKey(value: string | undefined) {
        this._match_key = value;
    }

    get matchCondition(): ConditionType {
        return this._match_condition;
    }

    set matchCondition(value: ConditionType) {
        this._match_condition = value;
    }

    get matchValue(): DataMapValue {
        return this._match_value;
    }

    set matchValue(value: DataMapValue) {
        this._match_value = value;
    }

    get platformDataContainerId(): ObjectID {
        return this._platform_data_container_id;
    }

    public updateMatch(
        platformDataContainer: PlatformDataContainer,
        match: string | PlatformDataMap,
    ) {
        if (typeof match === 'string') {
            //lets check this container allows for custom values
            if (platformDataContainer.allowCustom) {
                this._match = match;
            } else {
                throw new ValidationError(userMessages.noCustomValues, true);
            }
        } else {
            this._match = match.id;
        }
        this._platform_data_container_id = platformDataContainer.id;
    }
}
