class SocialLinkSerializer < ActiveModel::Serializer
  attributes :id, :facebook, :youtube, :github, :portfolio, :linkedin, :twitter
end
