import mongoose from "mongoose";

interface KLoukdoSuggestionAttrs {
    id?: string;
    product: string;
}

interface KLoukdoSuggestionModel extends mongoose.Model<KLoukdoSuggestionDoc> {
    build(attrs: KLoukdoSuggestionAttrs): KLoukdoSuggestionDoc;
}

interface KLoukdoSuggestionDoc extends mongoose.Document {
    id?: String;
    product: String;
}

const kLoukdoSuggestionSchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
})

kLoukdoSuggestionSchema.statics.build = (attrs: KLoukdoSuggestionAttrs) => {
    const _id = attrs.id
    delete attrs.id
    return new KLoukdoSuggestion({
        _id,
        ...attrs
    })
}

const KLoukdoSuggestion = mongoose.model<KLoukdoSuggestionDoc, KLoukdoSuggestionModel>(
    'KLoukdoSuggestion', kLoukdoSuggestionSchema
);

export {KLoukdoSuggestion, KLoukdoSuggestionAttrs, KLoukdoSuggestionDoc}